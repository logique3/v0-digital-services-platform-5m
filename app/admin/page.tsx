'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  averageOrderValue: number
  revenueByMonth: any[]
  ordersByStatus: any[]
  topServices: any[]
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')

        if (ordersError) throw ordersError

        // Fetch all payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')

        if (paymentsError) throw paymentsError

        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')

        if (usersError) throw usersError

        // Fetch recent orders with items and service details
        const { data: recentOrdersData, error: recentError } = await supabase
          .from('orders')
          .select(
            `
            id,
            total_amount,
            status,
            created_at,
            user_id,
            profiles(full_name, email),
            order_items(quantity, unit_price, services(name))
          `
          )
          .order('created_at', { ascending: false })
          .limit(5)

        if (recentError) throw recentError

        // Calculate stats
        const totalRevenue = (paymentsData || []).reduce((sum: number, payment: any) => {
          if (payment.status === 'completed') return sum + payment.amount
          return sum
        }, 0)

        const totalOrders = (ordersData || []).length
        const totalUsers = (usersData || []).length
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        // Group orders by status
        const statusCounts = (ordersData || []).reduce((acc: any, order: any) => {
          const status = order.status || 'pending'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})

        const ordersByStatus = Object.entries(statusCounts).map(([status, count]: [string, any]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
        }))

        // Group revenue by month
        const revenueByMonth: any = {}
        ;(paymentsData || []).forEach((payment: any) => {
          if (payment.status === 'completed') {
            const date = new Date(payment.created_at)
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + payment.amount
          }
        })

        const revenueByMonthArray = Object.entries(revenueByMonth).map(([month, revenue]: [string, any]) => ({
          month,
          revenue: Math.round(revenue * 100) / 100,
        }))

        setStats({
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          totalUsers,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          revenueByMonth: revenueByMonthArray,
          ordersByStatus,
          topServices: [],
          recentOrders: recentOrdersData || [],
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Failed to load analytics</p>
      </div>
    )
  }

  const COLORS = ['#0066CC', '#4A90E2', '#2ECC71', '#F39C12', '#E74C3C']

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} TND</div>
            <p className="text-xs text-muted-foreground">Total from completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All orders in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageOrderValue.toFixed(2)} TND</div>
            <p className="text-xs text-muted-foreground">Average revenue per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue by Month */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.revenueByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toFixed(2)} TND`} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0066CC"
                    strokeWidth={2}
                    dot={{ fill: '#0066CC', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.ordersByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No order data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p className="font-medium">
                            {order.profiles?.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.profiles?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.order_items?.length || 0} item(s)
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        {order.total_amount.toFixed(2)} TND
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
