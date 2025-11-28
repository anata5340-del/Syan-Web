type SubscriptionCardProps = {
  startedOn: string;
  price: number;
  access: boolean;
  billingDate: string;
};

export default function SubscriptionCard({
  startedOn,
  price,
  access,
  billingDate,
}: SubscriptionCardProps) {
  return (
    <div className="flex gap-10 justify-between">
      <div className="flex gap-3">
        <img src="/assets/img/icon51.png" alt="Started On" />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Started On</h2>
          <p className="text-lg font-normal">{startedOn}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <img src="/assets/img/icon51.png" alt="Price" />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Price</h2>
          <p className="text-lg font-normal">Rs: {price}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <img src="/assets/img/icon51.png" alt="Access" />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Access</h2>
          <p className="text-lg font-normal">
            {access ? "Access All Courses" : "Partial Access"}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <img src="/assets/img/icon51.png" alt="Billing Date" />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Billing Date</h2>
          <p className="text-lg font-normal">{billingDate}</p>
        </div>
      </div>
    </div>
  );
}
