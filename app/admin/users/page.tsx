'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, RefreshCw, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface UserStats {
  profile: UserProfile
  orderCount: number
  totalSpent: number
  lastOrder?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // For each user, fetch their orders and calculate stats
      const usersWithStats = await Promise.all(
        (profilesData || []).map(async (profile: UserProfile) => {
          const { data: ordersData } = await supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

          const orderCount = ordersData?.length || 0
          const totalSpent = (ordersData || []).reduce((sum: number, order: any) => sum + order.total_amount, 0)
          const lastOrder = ordersData?.[0]?.created_at

          return {
            profile,
            orderCount,
            totalSpent,
            lastOrder,
          }
        })
      )

      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile.phone.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage platform users and their activity
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={fetchUsers} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {filteredUsers.length} of {users.length} total users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Orders</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Total Spent</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.profile.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {user.profile.full_name}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {user.profile.email}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {user.profile.phone || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        {user.orderCount}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {user.totalSpent.toFixed(2)} TND
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(user.profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
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

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Details</CardTitle>
                <CardDescription>
                  {selectedUser.profile.full_name}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted p-4 rounded-lg">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedUser.profile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{selectedUser.profile.email}</p>
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.profile.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs">{selectedUser.profile.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div>
                <h3 className="font-semibold mb-3">Account Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {selectedUser.orderCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {selectedUser.totalSpent.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Spent (TND)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {selectedUser.orderCount > 0
                          ? (selectedUser.totalSpent / selectedUser.orderCount).toFixed(2)
                          : '0.00'}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Order (TND)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Account Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Account Timeline</h3>
                <div className="space-y-3 text-sm border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(selectedUser.profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-3">
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(selectedUser.profile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedUser.lastOrder && (
                    <div className="flex justify-between items-center border-t border-border pt-3">
                      <p className="text-muted-foreground">Last Order</p>
                      <p className="font-medium">
                        {new Date(selectedUser.lastOrder).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedUser.profile.email)
                    toast.success('Email copied to clipboard')
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Copy Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
