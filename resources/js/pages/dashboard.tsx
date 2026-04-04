import { Head, usePage } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    Calendar,
    TrendingUp
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export default function Dashboard() {
    const { stats, recent } = usePage().props as any;

    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6 space-y-8">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight ">
                        Dashboard
                    </h1>
                    <p className='text-sm '>
                        Overview of your event's RSVPs and guest activity
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">

                    <StatCard
                        title="Total RSVPs"
                        value={stats?.total_rsvps || 0}
                        icon={Users}
                        variant="blue"
                    />

                    <StatCard
                        title="Total Guests"
                        value={stats?.total_guests || 0}
                        icon={UserCheck}
                        variant="green"
                    />

                    <StatCard
                        title="Today RSVPs"
                        value={stats?.today_rsvps || 0}
                        icon={Calendar}
                        variant="amber"
                    />

                    <StatCard
                        title="Confirmed"
                        value={stats?.confirmed_rsvps || 0}
                        icon={UserCheck}
                        variant="purple"
                    />

                </div>
                {/* TABLE */}
                <Card className="border-muted/50 shadow-sm backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Latest RSVPs
                        </CardTitle>
                        <CardDescription>
                            A real-time view of the most recent RSVPs for your event.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {recent?.length > 0 ? (
                                    recent.map((item: any, i: number) => (
                                        <TableRow
                                            key={i}
                                            className="hover:bg-muted/60 transition"
                                        >
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {item.phone}
                                            </TableCell>

                                            <TableCell>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-600 dark:text-amber-400">
                                                    {item.guests_count} Guests
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                {new Date(item.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-muted-foreground py-12"
                                        >
                                            ✦ No RSVPs yet — waiting for guests 🎉
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </>
    );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon: Icon, variant }: any) {

    const variants: any = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    };

    return (
        <div className="bg-card border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">

            {/* LEFT */}
            <div>
                <p className="text-sm text-muted-foreground">
                    {title}
                </p>

                <h2 className="text-3xl font-semibold mt-1 tracking-tight">
                    {value}
                </h2>
            </div>

            {/* ICON */}
            <div className={`p-3 rounded-xl ${variants[variant]}`}>
                <Icon className="w-5 h-5" />
            </div>

        </div>
    );
}