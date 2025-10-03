import { useState, useEffect } from 'react';
import { getDailyReport, getTimePeriodReport } from '../../api/report.api';
import UsageChart from '../../components/dashboard/UsageChart';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ReportsPage = () => {
  const [report, setReport] = useState<any>(null);
  const [period, setPeriod] = useState('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      let data;
      if (period === 'day') {
        const today = new Date().toISOString().split('T')[0];
        data = await getDailyReport(today);
      } else {
        data = await getTimePeriodReport(period);
      }
      setReport(data);
    } catch (err) {
      setError('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="flex space-x-2 mb-6">
        <Button
          onClick={() => setPeriod('day')}
          variant={period === 'day' ? 'primary' : 'secondary'}
        >
          Daily
        </Button>
        <Button
          onClick={() => setPeriod('week')}
          variant={period === 'week' ? 'primary' : 'secondary'}
        >
          Weekly
        </Button>
        <Button
          onClick={() => setPeriod('month')}
          variant={period === 'month' ? 'primary' : 'secondary'}
        >
          Monthly
        </Button>
        <Button
          onClick={() => setPeriod('year')}
          variant={period === 'year' ? 'primary' : 'secondary'}
        >
          Yearly
        </Button>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Total {period === 'day' ? 'Today' : period}</h3>
              <p className="text-3xl font-bold">{report.totalAmount?.toFixed(2)} birr</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Total Sessions</h3>
              <p className="text-3xl font-bold">{report.totalSessions || report.totalPayments}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Usage Chart</h3>
            <UsageChart data={report.chartData || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;