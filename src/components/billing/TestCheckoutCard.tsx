import AuthNotice from "@/components/auth/AuthNotice";
import Button from "@/components/ui/Button";
import { abortTestOrderAction, completeTestOrderAction } from "@/lib/billing/actions/testCheckoutActions";

interface TestCheckoutCardProps {
  orderId: string;
  offerName: string;
  price: string;
  labels: { Title: string; Body: string; Pay: string; Abort: string; Eyebrow: string };
}

/** Stand-in for Stripe's page in local development: pay or abort, nothing else. */
export default function TestCheckoutCard({ orderId, offerName, price, labels }: TestCheckoutCardProps) {
  return (
    <div className="grid gap-6">
      <AuthNotice stamp={labels.Eyebrow} tone="signal" title={`${offerName} · ${price}`} body={labels.Body} />
      <div className="flex flex-wrap gap-3">
        <form action={completeTestOrderAction}>
          <input type="hidden" name="order" value={orderId} />
          <Button type="submit" label={labels.Pay} variant="signal" withArrow />
        </form>
        <form action={abortTestOrderAction}>
          <input type="hidden" name="order" value={orderId} />
          <Button type="submit" label={labels.Abort} variant="outline" />
        </form>
      </div>
    </div>
  );
}
