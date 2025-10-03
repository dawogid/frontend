import {
  Analytics,
  BarChart,
  CallReceived,
  EventBusy,
  Schedule,
  Speed,
  Timeline,
  TrendingUp,
  Update,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Typography,
} from '@mui/joy'
import { useTheme } from '@mui/joy/styles'
import moment from 'moment'
import { fmtDateTime, fmtDateTimeWithSeconds } from '../../utils/dateFormat'
import { Link, useParams } from 'react-router-dom'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useThingHistory } from '../../queries/ThingQueries'
import LoadingComponent from '../components/Loading'

const ThingsHistory = () => {
  const { id } = useParams()
  const theme = useTheme()
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useThingHistory(id)

  // Flatten all pages of history data
  const thingsHistory = data?.pages.flatMap(page => page.res) || []

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!thingsHistory.length) return []

    // Calculate average update frequency
    let avgUpdateFrequency = '--'
    if (thingsHistory.length > 1) {
      const oldestUpdate = moment(
        thingsHistory[thingsHistory.length - 1].createdAt,
      )
      const newestUpdate = moment(thingsHistory[0].createdAt)
      const totalDuration = newestUpdate.diff(oldestUpdate, 'hours')
      const frequency = totalDuration / (thingsHistory.length - 1)
      avgUpdateFrequency =
        frequency < 1
          ? `${Math.round(frequency * 60)} minutes`
          : frequency < 24
            ? `${Math.round(frequency)} hours`
            : `${Math.round(frequency / 24)} days`
    }

    const lastUpdated = thingsHistory[0]
      ? moment(thingsHistory[0].updatedAt).fromNow()
      : '--'

    // Calculate update trend value
    let updateTrend = '--'
    if (thingsHistory.length >= 3) {
      const diffs = thingsHistory
        .map((h, i, arr) =>
          i < arr.length - 1
            ? moment(h.createdAt).diff(arr[i + 1].createdAt, 'minutes')
            : null,
        )
        .filter(d => d !== null)
      const last = diffs[0]
      const prev = diffs[1]
      if (last > prev) updateTrend = 'Interval increasing'
      else if (last < prev) updateTrend = 'Interval decreasing'
      else updateTrend = 'Interval stable'
    }

    return [
      {
        icon: <Speed />,
        text: 'Update Frequency',
        subtext: `Every ${avgUpdateFrequency}`,
      },
      {
        icon: <Update />,
        text: 'Last Updated',
        subtext: lastUpdated,
      },
      {
        icon: <CallReceived />,
        text: 'Last Value',
        subtext: thingsHistory[0]?.state ?? '--',
      },
      {
        icon: <TrendingUp />,
        text: 'Update Trend',
        subtext: updateTrend,
      },
    ]
  }

  const analyticsData = calculateAnalytics()

  const handleLoadMore = () => {
    fetchNextPage()
  }

  const formatTimeDifference = (startDate, endDate) => {
    const diffInMinutes = moment(startDate).diff(endDate, 'minutes')
    let timeValue = diffInMinutes
    let unit = 'minute'

    if (diffInMinutes >= 60) {
      const diffInHours = moment(startDate).diff(endDate, 'hours')
      timeValue = diffInHours
      unit = 'hour'

      if (diffInHours >= 24) {
        const diffInDays = moment(startDate).diff(endDate, 'days')
        timeValue = diffInDays
        unit = 'day'
      }
    }

    return `${timeValue} ${unit}${timeValue !== 1 ? 's' : ''}`
  }
  // if loading show loading spinner:
  if (isLoading) {
    return <LoadingComponent />
  }

  if (error || !thingsHistory || thingsHistory.length === 0) {
    return (
      <Container
        maxWidth='md'
        sx={{
          textAlign: 'center',
          display: 'flex',
          // make sure the content is centered vertically:
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '50vh',
        }}
      >
        <EventBusy
          sx={{
            fontSize: '6rem',
            // color: 'text.disabled',
            mb: 1,
          }}
        />

        <Typography level='h3' gutterBottom>
          No history found
        </Typography>
        <Typography level='body1'>
          It looks like there is no history for this thing yet.
        </Typography>
        <Button variant='soft' sx={{ mt: 2 }}>
          <Link to='/things'>Go back to things</Link>
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth='md'>
      {/* Enhanced Analytics Header Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BarChart sx={{ fontSize: '1.5rem' }} />
          <Typography
            level='title-md'
            sx={{ fontWeight: 'lg', color: 'text.primary' }}
          >
            Things Overview
          </Typography>
        </Box>

        {/* Statistics Cards Grid - Compact Design */}
        <Grid container spacing={0.5} sx={{ mb: 2 }}>
          {analyticsData.map((info, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Card
                variant='soft'
                sx={{
                  borderRadius: 'sm',
                  p: 1,
                  height: 85,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ opacity: 0.8, flexShrink: 0 }}>{info.icon}</Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.25,
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    level='body-xs'
                    sx={{
                      fontWeight: '600',
                      color: 'text.primary',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      fontSize: '0.75rem',
                    }}
                  >
                    {info.text}
                  </Typography>
                  <Typography
                    level='body-xs'
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      fontSize: '0.7rem',
                    }}
                  >
                    {info.subtext || '--'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Chart Section Header */}
      {thingsHistory.every(history => !isNaN(history.state)) &&
        thingsHistory.length > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Analytics sx={{ fontSize: '1.5rem' }} />
            <Typography
              level='title-md'
              sx={{ fontWeight: 'lg', color: 'text.primary' }}
            >
              Data Visualization
            </Typography>
          </Box>
        )}
      {/* check if all the states are number the show it: */}
      {thingsHistory.every(history => !isNaN(history.state)) &&
        thingsHistory.length > 1 && (
          <Box sx={{ borderRadius: 'sm', p: 2, boxShadow: 'md', mb: 4 }}>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart
                width={500}
                height={300}
                data={thingsHistory.toReversed()}
              >
                {/* <CartesianGrid strokeDasharray='3 3' /> */}
                <XAxis
                  dataKey='updatedAt'
                  hide='true'
                  tick='false'
                  tickLine='false'
                  axisLine='false'
                  tickFormatter={tick => moment(tick).format('ddd DD.MM.YYYY HH:mm:ss')}
                />
                <YAxis
                  hide='true'
                  dataKey='state'
                  tick='false'
                  tickLine='true'
                  axisLine='false'
                />
                <Tooltip
                  labelFormatter={label => moment(label).format('ddd DD.MM.YYYY HH:mm:ss')}
                />

                <Line
                  type='monotone'
                  dataKey='state'
                  stroke={theme.palette.primary[500]}
                  activeDot={{
                    r: 8,
                    fill: theme.palette.primary[600],
                    stroke: theme.palette.primary[300],
                  }}
                  dot={{
                    r: 4,
                    fill: theme.palette.primary[500],
                    stroke: theme.palette.primary[300],
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

      {/* History Section Header */}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Timeline sx={{ fontSize: '1.5rem' }} />
        <Typography
          level='title-md'
          sx={{ fontWeight: 'lg', color: 'text.primary' }}
        >
          Change History
        </Typography>
      </Box>
      <Box sx={{ borderRadius: 'sm', p: 1, boxShadow: 'md' }}>
        <List sx={{ p: 0 }}>
          {thingsHistory.map((history, index) => (
            <Box key={index}>
              <ListItem
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 'sm',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'background.level1',
                  },
                }}
              >
                <ListItemContent>
                  <Grid container spacing={1} alignItems='center'>
                    {/* First Row: Status and Time Info */}
                    <Grid xs={12} sm={8}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Avatar
                          size='sm'
                          color='primary'
                          variant='solid'
                          sx={{
                            width: 24,
                            height: 24,
                            '& svg': { fontSize: '14px' },
                          }}
                        >
                          <TrendingUp />
                        </Avatar>

                        <Typography
                          level='body-sm'
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'md',
                            display: { xs: 'none', sm: 'block' },
                          }}
                        >
                          Updated
                        </Typography>

                        <Chip
                          size='sm'
                          variant='soft'
                          color='primary'
                          startDecorator={<Schedule />}
                        >
                          {fmtDateTime(history.updatedAt)}
                        </Chip>
                      </Box>
                    </Grid>

                    {/* Second Row: State Value */}
                    <Grid xs={12} sm={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Chip
                          size='md'
                          variant='solid'
                          color='success'
                          sx={{ fontWeight: 'bold' }}
                        >
                          {history.state}
                        </Chip>
                      </Box>
                    </Grid>
                  </Grid>
                </ListItemContent>
              </ListItem>

              {/* Divider with time difference */}
              {index < thingsHistory.length - 1 && (
                <ListDivider
                  component='li'
                  sx={{
                    my: 0.5,
                  }}
                >
                  <Typography
                    level='body-xs'
                    sx={{
                      color: 'text.tertiary',
                      backgroundColor: 'background.surface',
                      px: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatTimeDifference(
                      history.createdAt,
                      thingsHistory[index + 1].createdAt,
                    )}{' '}
                    before
                  </Typography>
                </ListDivider>
              )}
            </Box>
          ))}
        </List>
      </Box>
      {/* Load more Button  */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        <Button
          variant='plain'
          fullWidth
          color='primary'
          onClick={handleLoadMore}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading...'
            : !hasNextPage
              ? 'No more history'
              : 'Load more'}
        </Button>
      </Box>
    </Container>
  )
}

export default ThingsHistory
