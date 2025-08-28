## Dashboard Overview & Validation

### Key Performance Indicators (KPIs)
The top section displays four critical metrics for gym management.

<img src="screenshots/kpi-cards.png" alt="KPI Cards" width="600"/>

*   **Total Members:** The sum of all unique members in the dataset. **Validation:** This count (`112`) matches the number of entries in the raw data array.
*   **Monthly Attendance Rate:** The percentage of members with a 'status' marked as 'active'. Calculated as `(Active Members / Total Members) * 100`. **Validation:** `84 / 112 = 75%`, which matches the displayed value.
*   **Avg. Daily Check-ins:** The average number of members who check in per day. **Validation:** Calculated from the last 7 days of sample check-in data.
*   **Churn Risk:** The average churn risk score across all members. **Validation:** Manually calculated the average of the `churnRisk` property for all members.

### Charts & Graphs
The dashboard provides visual insights into membership trends.

<img src="screenshots/charts.png" alt="Dashboard Charts" width="600"/>

*   **Daily Check-ins Chart:** Shows simulated check-in data for a week. Validated against the sample data structure in the code.
*   **Membership Distribution Chart:** Shows the count of each membership type. **Validation:** The segment sizes directly match the count of `Premium`, `Standard`, etc., types in the member objects.
*   **Churn Risk Analysis:** Displays the proportion of members in each risk category (Low: <30%, Medium: 30-70%, High: >70%). **Validation:** The percentages are calculated dynamically from the `churnRisk` score of each member and update correctly when members are added or checked in.
