// Empty statistics until activity is recorded. Job totals come from MongoDB.
export const companyDashboardData = {
  "dateRange": "All time",
  "stats": [
    {
      "id": "candidates",
      "value": 0,
      "label": "New candidates to review",
      "href": "/company/applicants",
      "color": "bg-indigo-600"
    },
    {
      "id": "schedule",
      "value": 0,
      "label": "Schedule for today",
      "href": "/company/schedule",
      "color": "bg-emerald-500"
    },
    {
      "id": "messages",
      "value": 0,
      "label": "Messages received",
      "href": "/company/messages",
      "color": "bg-cyan-500"
    }
  ],
  "jobsOpen": 0,
  "applicantsSummary": {
    "total": 0,
    "breakdown": [
      {
        "label": "Full Time",
        "count": 0,
        "color": "bg-indigo-600"
      },
      {
        "label": "Part-Time",
        "count": 0,
        "color": "bg-emerald-500"
      },
      {
        "label": "Internship",
        "count": 0,
        "color": "bg-amber-400"
      },
      {
        "label": "Contract",
        "count": 0,
        "color": "bg-rose-400"
      },
      {
        "label": "Remote",
        "count": 0,
        "color": "bg-cyan-500"
      }
    ]
  },
  "chart": {
    "Week": [
      {
        "label": "Mon",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Tue",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Wed",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Thu",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Fri",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Sat",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Sun",
        "view": 0,
        "applied": 0
      }
    ],
    "Month": [
      {
        "label": "Week 1",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Week 2",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Week 3",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Week 4",
        "view": 0,
        "applied": 0
      }
    ],
    "Year": [
      {
        "label": "Jan",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Feb",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Mar",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Apr",
        "view": 0,
        "applied": 0
      },
      {
        "label": "May",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Jun",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Jul",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Aug",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Sep",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Oct",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Nov",
        "view": 0,
        "applied": 0
      },
      {
        "label": "Dec",
        "view": 0,
        "applied": 0
      }
    ]
  },
  "summaries": {
    "Week": {
      "label": "This Week",
      "views": 0,
      "viewsChange": "0%",
      "viewsUp": true,
      "applied": 0,
      "appliedChange": "0%",
      "appliedUp": false
    },
    "Month": {
      "label": "This Month",
      "views": 0,
      "viewsChange": "0%",
      "viewsUp": true,
      "applied": 0,
      "appliedChange": "0%",
      "appliedUp": true
    },
    "Year": {
      "label": "This Year",
      "views": 0,
      "viewsChange": "0%",
      "viewsUp": true,
      "applied": 0,
      "appliedChange": "0%",
      "appliedUp": true
    }
  },
  "jobUpdates": []
};
