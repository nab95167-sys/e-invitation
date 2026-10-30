import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import UsersClient from "./UsersClient";
import UsersAccessRestricted from "./UsersAccessRestricted";

export default async function UsersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // If user role does not have user management privileges (e.g. GUEST or ORGANIZER),
  // render the secure Access Restricted overview instead of an unhelpful redirect.
  if (session.role !== "SUPERADMIN" && session.role !== "COUPLE") {
    return <UsersAccessRestricted user={session} />;
  }

  const whereClause: any = {};
  if (session.role === "COUPLE") {
    whereClause.OR = [
      { id: session.userId },
      { role: { in: ["ORGANIZER", "GUEST"] } },
    ];
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      permissions: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <UsersClient
      initialUsers={users}
      currentUserId={session.userId}
      currentUserRole={session.role}
    />
  );
}
