import { memo } from 'react';

function PlatformTableHeader() {
  return (
    <thead>
      <tr>
        <th className="w-[40px] px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3]"></th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Platform
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Provider
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Category
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Market Share
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Pricing
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Context
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Priority
        </th>
        <th className="px-4 py-3 text-left bg-[#FAFAFA] border-b border-[#EDE8E3] text-[#5C524D] whitespace-nowrap">
          Actions
        </th>
      </tr>
    </thead>
  );
}

export default memo(PlatformTableHeader);
