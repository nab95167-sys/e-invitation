import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || session.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <UsersClient initialUsers={users} currentUserId={session.userId} />;
}
