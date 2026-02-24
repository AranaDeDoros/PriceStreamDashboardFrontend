import React from 'react';
import { useAllRuns } from '../api/runs';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Run } from '../domain/api_contract';
import Card from '../components/Card';

const columnHelper = createColumnHelper<Run>();

/* Copyable ID Component */
const CopyableId: React.FC<{ id: string }> = ({ id }) => {
  const [copied, setCopied] = React.useState(false);

  const shortId = `${id.slice(0, 6)}...${id.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative inline-block">
      <span
        onClick={handleCopy}
        className="font-mono text-xs text-gray-600 transition hover:text-indigo-600"
      >
        {shortId}
      </span>

      <div
        className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-md transition-all duration-200 ${
          copied ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        Id Copied!
      </div>
    </div>
  );
};

/* Helpers */
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    case 'running':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardPage: React.FC = () => {
  const { data: runs, error, isLoading } = useAllRuns();
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredRuns = React.useMemo(() => {
    if (!runs) return [];
    if (statusFilter === 'all') return runs;
    return runs.filter((r) => r.status.toLowerCase() === statusFilter);
  }, [runs, statusFilter]);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => 'ID',
        cell: (info) => <CopyableId id={info.getValue()} />,
      }),
      columnHelper.accessor('startedAt', {
        header: () => 'Started',
        cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '-'),
      }),
      columnHelper.accessor('finishedAt', {
        header: () => 'Finished',
        cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : '-'),
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
        cell: (info) => (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
              info.getValue(),
            )}`}
          >
            {info.getValue()}
          </span>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: filteredRuns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const statusData = React.useMemo(() => {
    if (!runs) return [];
    const counts: Record<string, number> = {};
    runs.forEach((run) => {
      counts[run.status] = (counts[run.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [runs]);

  const stats = React.useMemo(() => {
    if (!runs) return {};
    return {
      total: runs.length,
      completed: runs.filter((r) => r.status === 'Completed').length,
      failed: runs.filter((r) => r.status === 'Failed').length,
      running: runs.filter((r) => r.status === 'Running').length,
    };
  }, [runs]);

  if (isLoading) {
    return <Card title="Loading..." text="Fetching runs from the server. Please wait." />;
  }

  if (error) {
    return <Card title="Error" text={`Error loading runs: ${error.message}`} />;
  }

  if (!runs || runs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl p-4">
          <div className="flex h-screen flex-col items-center justify-center text-center">
            <Card title="" text="Sorry, there are no runs to display." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Ingestion Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Runs" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Failed" value={stats.failed} />
        <StatCard label="Running" value={stats.running} />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Filter by status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>
      </div>

      {/* Table */}
      <div className="h-128 overflow-y-scroll rounded-2xl bg-[#566999] p-6 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-[#ddd] uppercase"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer rounded-xl bg-[#d3dcf2] transition hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-[#d3dcf2] p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Runs by Status</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
          style={{ backgroundColor: '#f0f3fc', borderRadius: '12px' }}
        >
          <PieChart>
            <Tooltip />
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label
            >
              {statusData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* Small Stat Card */
const StatCard: React.FC<{ label: string; value?: number }> = ({ label, value }) => (
  <div className="rounded-xl bg-[#566999] p-4 shadow-md">
    <div className="text-sm text-[#ddd]">{label}</div>
    <div className="mt-2 text-2xl font-bold text-[#ddd]">{value ?? 0}</div>
  </div>
);

export default DashboardPage;
