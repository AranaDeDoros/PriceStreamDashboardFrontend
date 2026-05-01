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
import { useAllPlatforms } from '../api/platforms';

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
        className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-xl transition-all duration-200 ${
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
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10';
    case 'failed':
      return 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10';
    case 'running':
      return 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-500/10';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 shadow-sm';
  }
};

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardPage: React.FC = () => {
  const {
    data: runs,
    error,
    isLoading,
    refetch,
    isFetching,
    dataUpdatedAt: runsUpdatedAt,
  } = useAllRuns();
  const {
    data: platforms,
    error: platformError,
    isLoading: platformLoading,
    dataUpdatedAt: platformsUpdatedAt,
  } = useAllPlatforms();
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [platformFilter, setPlatformFilter] = React.useState<string>('all');

  const lastUpdated = Math.max(runsUpdatedAt, platformsUpdatedAt);
  const formattedLastUpdated = React.useMemo(() => {
    return lastUpdated > 0
      ? new Date(lastUpdated).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      : 'Never';
  }, [lastUpdated]);

  const filteredRuns = React.useMemo(() => {
    if (!runs) return [];
    return runs.filter((r) => {
      const matchStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter;
      const matchPlatform = platformFilter === 'all' || r.platform === platformFilter;
      return matchStatus && matchPlatform;
    });
  }, [runs, statusFilter, platformFilter]);

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
            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(
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

  if (platformLoading) {
    return <Card title="Loading..." text="Fetching platforms from the server. Please wait." />;
  }

  if (error) {
    return <Card title="Error" text={`Error loading runs: ${error.message}`} />;
  }

  if (platformError) {
    return <Card title="Error" text={`Error loading platforms: ${platformError.message}`} />;
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
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h1 className="text-4xl font-black tracking-tight text-gray-800">Ingestion Dashboard</h1>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <div className={`h-2 w-2 rounded-full ${isFetching ? 'animate-pulse bg-indigo-500' : 'bg-emerald-500'}`} />
          Last updated: <span className="text-gray-600">{formattedLastUpdated}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Runs" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Failed" value={stats.failed} />
        <StatCard label="Running" value={stats.running} />
      </div>

      {/* Refresh */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-indigo-600 hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {isFetching ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Refreshing...
            </>
          ) : (
            'Refresh'
          )}
        </button>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-all hover:border-gray-300 hover:shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Platform:
            </span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-all hover:border-gray-300 hover:shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              <option value="all">All</option>
              {platforms && platforms.length > 0 ? (
                platforms.map((platform) => (
                  <option key={platform.id} value={platform.name}>
                    {platform.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="h-128 overflow-y-scroll rounded-2xl border border-[#4a5a82] bg-gradient-to-br from-[#566999] to-[#485985] p-6 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-xs font-bold tracking-widest text-indigo-100/70 uppercase"
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
                  className="group cursor-pointer rounded-xl bg-gradient-to-r from-[#d3dcf2] to-[#c5d1eb] shadow-sm transition-all hover:from-white hover:to-white hover:shadow-md active:scale-[0.99]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-900"
                    >
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
      <div className="rounded-2xl border border-[#b8c5e6] bg-gradient-to-br from-[#d3dcf2] to-[#c5d1eb] p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-800">Runs by Status</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '16px',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          <PieChart>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {statusData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* Small Stat Card */
const StatCard: React.FC<{ label: string; value?: number }> = ({ label, value }) => (
  <div className="group rounded-xl border border-[#4a5a82] bg-gradient-to-br from-[#566999] to-[#485985] p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:brightness-110">
    <div className="text-xs font-bold tracking-wider text-indigo-100/60 uppercase">{label}</div>
    <div className="mt-2 text-3xl font-black text-white">{value ?? 0}</div>
    <div className="mt-2 h-1 w-0 bg-indigo-400 transition-all group-hover:w-full" />
  </div>
);

export default DashboardPage;
