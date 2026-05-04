# Background Tasks Migration

This document describes the migration of background tasks from the NestJS backend to the Next.js backend-revamp.

## Overview

Background tasks for scraping movies and tools have been migrated from the NestJS server to the Next.js application. The tasks run on a scheduled basis using Vercel Cron jobs.

## Tasks

### 1. Movie Scraping Task
- **Endpoint**: `POST /api/doraemon/movie/scrape`
- **Schedule**: Every Sunday at 00:00 UTC (configurable in `vercel.json`)
- **Function**: Scrapes movies from `https://chinesedora.com/database/movie/`
- **Actions**:
  - Iterates through all pages until no results
  - Inserts/updates movies in the database
  - Clears movie cache

### 2. Tool Scraping Task
- **Endpoint**: `POST /api/doraemon/tool/scrape`
- **Schedule**: Every Sunday at 00:00 UTC (configurable in `vercel.json`)
- **Function**: Scrapes tools from `https://doranew.net/page/`
- **Actions**:
  - Iterates through all pages until no results
  - Inserts/updates tools in the database
  - Clears tool cache

### 3. All Tasks (Combined)
- **Endpoint**: `POST /api/tasks`
- **Function**: Runs both movie and tool scraping tasks
- **Useful for**: Manual triggering or testing

## Configuration

### External Scheduler Configuration

You'll need to set up an external scheduler (like cron-job.org, EasyCron, AWS EventBridge, or your own cron service) to call the task endpoints.

Example cron schedules:
- Every Sunday at 00:00 UTC: 0 0 * * 0
- Daily at 00:00 UTC: 0 0 * * *
- Every 6 hours: 0 */6 * * *

### Security

All task endpoints require authentication via the `x-api-key` header.

Example header:

```bash
X-API-KEY: YOUR_API_KEY
```

Set the `API_KEY` environment variable in your Vercel project settings. Default is `api-key-default` if not set.

## Files Modified/Created

### New Files
- `server/services/scrapService.ts` - Scraping logic using Cheerio
- `server/services/taskService.ts` - Task orchestration logic
- `app/api/tasks/route.ts` - Combined tasks endpoint

### Modified Files
- `server/services/movieService.ts` - Updated `scrapeMoviesFromSource()` to use actual scraper
- `server/services/toolService.ts` - Updated `scrapeToolsFromSource()` to use actual scraper
- `app/api/doraemon/movie/scrape/route.ts` - Updated to use TaskService with auth
- `app/api/doraemon/tool/scrape/route.ts` - Updated to use TaskService with auth
- `vercel.json` - Added cron job configuration

## Manual Testing

### Test with cURL
```bash

# Test movie scraping (GET)
curl "https://your-app.vercel.app/api/doraemon/movie/scrape" -H "x-api-key: YOUR_API_KEY"

# Test tool scraping (GET)
curl "https://your-app.vercel.app/api/doraemon/tool/scrape" -H "x-api-key: YOUR_API_KEY"

# Test all tasks (GET)
curl "https://your-app.vercel.app/api/tasks" -H "x-api-key: YOUR_API_KEY"

# Check task status
curl "https://your-app.vercel.app/api/tasks" \
  -H "x-api-key: YOUR_API_KEY"

## Health check

You can check application health (including DB availability and counts) using the health endpoint.

```bash
# GET health
curl "https://your-app.vercel.app/api/doraemon/health" -H "x-api-key: YOUR_API_KEY"

# Some schedulers only support POST; POST is supported as well
curl -X POST "https://your-app.vercel.app/api/doraemon/health" -H "x-api-key: YOUR_API_KEY"
```
```

### Setup External Scheduler Examples

Using cron-job.org:
1. Go to https://cron-job.org/
2. Create new cron job
3. Set URL: https://your-app.vercel.app/api/doraemon/movie/scrape
4. Add header `x-api-key: YOUR_API_KEY` in the scheduler configuration
4. Set schedule: 0 0 * * 0 (weekly) or your preferred schedule
5. Save and enable

Using your own cron server:
```bash
# In your cron file
0 0 * * 0 curl -X POST "https://your-app.vercel.app/api/doraemon/movie/scrape" -H "x-api-key: YOUR_API_KEY"
0 0 * * 0 curl -X POST "https://your-app.vercel.app/api/doraemon/tool/scrape" -H "x-api-key: YOUR_API_KEY"
```

## Logging

Tasks output detailed logs to the console for monitoring:

```
[TASK] Starting movie scraping task
[TASK] Scraping movies page 1
[TASK] Scraped 123 movies total
[TASK] Clearing movie cache
[TASK] Movie scraping task completed successfully
```

## Differences from NestJS Implementation

| Aspect | NestJS | Next.js |
|--------|--------|---------|
| Scheduler | `@nestjs/schedule` (CronJob) | Vercel Cron Jobs |
| Scheduler | @nestjs/schedule (CronJob) | External scheduler (cron-job.org, etc.) |
| Startup | Auto-starts on app init | Triggered by external scheduler |
| Triggering | Automatic or manual via provider | External scheduler HTTP requests |
| Background Execution | Thread-based | Async functions |
| Cache | Redis | In-memory/ISR |
| Security | No auth by default | `x-api-key` header required |

## Environment Variables

```env
API_KEY=your-strong-random-api-key  # Required for task authentication
```

## Monitoring

For production monitoring:
1. Check Vercel Function Logs in the Vercel dashboard
2. Monitor the API response status codes
3. Set up alerts for failed tasks (non-200/202 responses)
4. Review console logs for scraping errors
5. Monitor external scheduler logs/history

## Troubleshooting

### Tasks not running
1. Verify API_KEY is set in Vercel environment variables
2. Verify external scheduler is enabled and configured correctly
3. Check Vercel Function Logs for errors
4. Test the endpoint directly with cURL including the API key
5. Verify the API key in scheduler matches the environment variable

### Scraping returns no results
1. Check if the target websites have changed their HTML structure
2. Review console logs for parsing errors
3. Update Cheerio selectors in `scrapService.ts` if needed

### Authorization errors
1. Verify the `x-api-key` header is included in the scheduler request
2. Verify the header value matches your `API_KEY` environment variable
3. Check the scheduler configuration has the correct API key

## Future Enhancements

- [ ] Add task result logging to database
- [ ] Implement task retry logic for failed pages
- [ ] Add email notifications for task failures
- [ ] Create admin dashboard to monitor task execution
- [ ] Implement incremental scraping (only new items)
