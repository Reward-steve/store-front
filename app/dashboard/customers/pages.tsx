import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Users } from "lucide-react";
import { getShopByUser } from "../../actions/settings";
import { getCustomers } from "../../actions/customers";
import { getPlanStatus } from "../../lib/plans";
import EmptyState from "../../components/ui/EmptyState";
import CustomerRow from "./_components/CustomerRow";

export default async function CustomersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const shop = await getShopByUser();
  if (!shop) redirect("/onboarding");

  const status = getPlanStatus(shop);
  if (status.plan !== "pro") {
    redirect("/dashboard/subscription?locked=customers");
  }

  const customers = await getCustomers();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-text leading-tight">Customers</h1>
        <p className="text-text-muted text-xs mt-0.5">
          Everyone who has ordered from your shop, sorted by how much
          they&apos;ve spent.
        </p>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No customers yet"
          description="Once someone places an order, they'll show up here."
        />
      ) : (
        <div className="space-y-2">
          {customers.map((c) => (
            <CustomerRow key={c.phone} customer={c} />
          ))}
        </div>
      )}
    </div>
  );
}
