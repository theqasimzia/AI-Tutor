"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MoreHorizontal, Shield, User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllUsers } from "@/lib/queries/admin"
import { deleteUser, updateUserRole } from "@/app/actions/admin-actions"

type UserData = Awaited<ReturnType<typeof getAllUsers>>[number]

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchUsers = (searchTerm?: string) => {
        setLoading(true)
        getAllUsers(searchTerm || undefined).then((u) => {
            setUsers(u)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(search), 300)
        return () => clearTimeout(timer)
    }, [search])

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        await deleteUser(userId)
        fetchUsers(search)
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        await updateUserRole(userId, newRole)
        fetchUsers(search)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <Button>Add User</Button>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Role</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User className="h-4 w-4" />
                                    </div>
                                    {user.name ?? "—"}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'ADMIN' && <Shield className="h-3 w-3 text-red-500" />}
                                        <span>{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-600/20">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            {user.role !== "ADMIN" && (
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                                                    Make Admin
                                                </DropdownMenuItem>
                                            )}
                                            {user.role !== "PARENT" && (
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, "PARENT")}>
                                                    Make Parent
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user.id)}>
                                                Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
