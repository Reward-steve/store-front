// app/dashboard/more/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getShopByUser } from "../../actions/settings";
import MoreMenuClient from "../../components/dashboard/MoreMenuClient";
export default async function MorePage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  return <MoreMenuClient plan={shop.plan} />;
}
