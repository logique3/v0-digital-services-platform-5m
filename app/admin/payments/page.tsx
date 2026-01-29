'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'

interface Payment {
  id: string
  order_id: string
  amount: number
  method: string
  transaction_id?: string
  status: string
  created_at: string
  orders?: {
    user_id: string
    profiles?: {
      full_name: string
      email: string
    }
  }
}

interface PaymentStats {
  totalPayments: number
  totalAmount: number
  successfulAmount: number
  pendingAmount: number
  failedAmount: number
  paymentMethods: Record<string, number>
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select(
          `
          id,
          order_id,
          amount,
          method,
          transaction_id,
          status,
          created_at,
          orders(
            user_id,
            profiles(full_name, email)
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) throw error

      setPayments(data || [])

      // Calculate stats
      const paymentStats: PaymentStats = {
        totalPayments: data?.length || 0,
        totalAmount: 0,
        successfulAmount: 0,
        pendingAmount: 0,
        failedAmount: 0,
        paymentMethods: {},
      }

      ;(data || []).forEach((payment: Payment) => {
        paymentStats.totalAmount += payment.amount

        if (payment.status === 'completed') {
          paymentStats.successfulAmount += payment.amount
        } else if (payment.status === 'pending') {
          paymentStats.pendingAmount += payment.amount
        } else if (payment.status === 'failed') {
          paymentStats.failedAmount += payment.amount
        }

        const method = payment.method || 'unknown'
        paymentStats.paymentMethods[method] =
          (paymentStats.paymentMethods[method] || 0) + 1
      })

      setStats(paymentStats)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId)

      if (error) throw error

      setPayments(
        payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status: newStatus } : payment
        )
      )

      if (selectedPayment?.id === paymentId) {
        setSelectedPayment({ ...selectedPayment, status: newStatus })
      }

      toast.success(`Payment status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating payment:', error)
      toast.error('Failed to update payment')
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus ? payment.status === selectedStatus : true

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const statusOptions = ['pending', 'completed', 'failed']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all payment transactions
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAmount.toFixed(2)} TND
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.successfulAmount.toFixed(2)} TND
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingAmount.toFixed(2)} TND
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failedAmount.toFixed(2)} TND
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by payment ID, order ID, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={fetchPayments} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Tabs
            value={selectedStatus || 'all'}
            onValueChange={(v) => setSelectedStatus(v === 'all' ? null : v)}
          >
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              {statusOptions.map((status) => (
                <TabsTrigger key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
          <CardDescription>
            {filteredPayments.length} of {payments.length} total payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Payment ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-mono text-xs">
                        {payment.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-xs">
                        {payment.order_id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        {payment.amount.toFixed(2)} TND
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">
                        {payment.method}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowDetails(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Payment #{selectedPayment.id.slice(0, 8).toUpperCase()}
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setShowDetails(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Info */}
              <div>
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted p-4 rounded-lg">
                  <div>
                    <p className="text-muted-foreground">Payment ID</p>
                    <p className="font-mono text-xs">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono text-xs">{selectedPayment.order_id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-bold text-primary">
                      {selectedPayment.amount.toFixed(2)} TND
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Method</p>
                    <p className="font-medium capitalize">{selectedPayment.method}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedPayment.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(selectedPayment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction ID */}
              {selectedPayment.transaction_id && (
                <div>
                  <h3 className="font-semibold mb-3">Transaction Reference</h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs">
                    {selectedPayment.transaction_id}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={
                        selectedPayment.status === status ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => updatePaymentStatus(selectedPayment.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
