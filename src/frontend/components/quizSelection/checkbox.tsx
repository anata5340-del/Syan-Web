
interface CheckboxProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox ({ label, count, checked, onChange }: CheckboxProps) {
    
  return (
    <div className="flex gap-2 items-center">
      <input
        type="checkbox"
        className="checkbox-round"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
      <div className="border border-[#3E3E3E] rounded-sm px-2">{count}</div>
    </div>
  );
};