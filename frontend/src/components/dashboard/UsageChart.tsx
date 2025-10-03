import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type UsageChartProps = {
  data: { date: string; amount: number }[];
};

const UsageChart = ({ data }: UsageChartProps) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: any) => [`${value} birr`, 'Revenue']} />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;