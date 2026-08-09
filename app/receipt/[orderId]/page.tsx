// app/receipt/[orderId]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { db } from "../../lib/db";
import { formatNaira } from "../../lib/utils";
import { OrderItem } from "../../types";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { shop: true },
  });

  const title = order ? `New order — ${order.shop.shopName}` : "Order receipt";

  return {
    title,
    openGraph: {
      title,
      images: [
        `${process.env.NEXT_PUBLIC_APP_URL}/api/receipt/${orderId}/image`,
      ],
    },
  };
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { shop: true },
  });

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-center text-white">
        <p className="text-sm text-gray-400">
          This order couldn&apos;t be found. It may have been removed.
        </p>
      </div>
    );
  }

  const items = order.items as unknown as OrderItem[];

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            New order
          </p>
          <h1 className="mt-1 text-2xl font-black">{order.shop.shopName}</h1>
        </div>

        {/* Dev-only: raw imageUrl values, so a bad Cloudinary link is
            visible on the page instead of hidden in server logs.
            Remove this block once images are confirmed working. */}
        {process.env.NODE_ENV !== "production" && (
          <pre className="mb-4 overflow-x-auto rounded-lg bg-black p-2 text-[9px] text-gray-500">
            {JSON.stringify(
              items.map((i) => ({ name: i.name, imageUrl: i.imageUrl })),
              null,
              2,
            )}
          </pre>
        )}

        {/* Items card */}
        <div className="rounded-3xl border border-white/[0.06] bg-[#141414] p-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Items
          </p>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0a0a]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageOff className="h-4 w-4 text-gray-700" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatNaira(item.price)}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold text-white">
                  {formatNaira(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-white/[0.08] pt-4">
            <span className="text-sm font-bold text-gray-400">Total</span>
            <span className="text-lg font-black text-emerald-400">
              {formatNaira(order.total)}
            </span>
          </div>
        </div>

        {/* Customer card */}
        <div className="mt-4 rounded-3xl border border-white/[0.06] bg-[#141414] p-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Customer
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-white">Name: </span>
              {order.customerName}
            </p>
            <p>
              <span className="font-semibold text-white">Phone: </span>
              {order.customerPhone}
            </p>
            <p>
              <span className="font-semibold text-white">Address: </span>
              {order.customerAddress}
            </p>
          </div>
        </div>

        <Link
          href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-2xl bg-emerald-500 py-3 text-center text-sm font-bold text-black transition-colors hover:bg-emerald-400"
        >
          Message customer on WhatsApp
        </Link>

        <p className="mt-6 text-center text-xs text-gray-600">
          Powered by Trazo
        </p>
      </div>
    </div>
  );
}
