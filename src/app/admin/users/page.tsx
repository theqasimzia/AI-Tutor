"use client"

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

const users = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Student", status: "Active" },
    { id: 2, name: "Bob Jones", email: "bob@example.com", role: "Parent", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Student", status: "Inactive" },
    { id: 4, name: "David Wilson", email: "david@example.com", role: "Admin", status: "Active" },
    { id: 5, name: "Eve Davis", email: "eve@example.com", role: "Student", status: "Active" },
    { id: 6, name: "Frank Miller", email: "frank@example.com", role: "Parent", status: "Active" },
]

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <Button>Add User</Button>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search users..." className="pl-9" />
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
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User className="h-4 w-4" />
                                    </div>
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'Admin' && <Shield className="h-3 w-3 text-red-500" />}
                                        <span>{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20'
                                        }`}>
                                        {user.status}
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
                                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
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
