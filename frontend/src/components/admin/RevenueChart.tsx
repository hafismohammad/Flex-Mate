import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  
  // Update the type definition to include 'trainerRevenue' and 'adminRevenue'
  interface RevenueChartProps {
    data: {
      year: number;
      month: number;
      trainerRevenue: number;
      adminRevenue: number;
    }[];
  }
  
  const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed months
    const oneYearAgo = new Date(currentYear, currentMonth - 12, 1); // Set to the first day of the month, 12 months ago
  console.log('data',data);
  
    const last12MonthsData = (data || [])
      .map((item) => ({
        name: `${item.month}/${item.year}`, // Format as "month/year"
        trainerRevenue: item.trainerRevenue, // Use trainerRevenue
        adminRevenue: item.adminRevenue, // Use adminRevenue
      }))
      .filter((item) => {
        // Split "month/year" and convert to numbers
        const [month, year] = item.name.split('/').map(Number);
        const itemDate = new Date(year, month - 1, 1); // Create date for the item's month and year
        return itemDate >= oneYearAgo && itemDate <= today;
      })
      .sort((a, b) => {
        // Sort by parsed date
        const [monthA, yearA] = a.name.split('/').map(Number);
        const [monthB, yearB] = b.name.split('/').map(Number);
        return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
      });
  
    return (
      <ResponsiveContainer width="95%" height="100%">
        <LineChart
          data={last12MonthsData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickCount={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="trainerRevenue" stroke="#8884d8" />
          <Line type="monotone" dataKey="adminRevenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  export default RevenueChart;
  