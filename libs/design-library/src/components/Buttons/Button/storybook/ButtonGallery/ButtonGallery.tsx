import { Button, buttonSizes, buttonVariants } from "../../Button";
export const ButtonGallery = () => {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {buttonVariants.map((variant) => (
              <th
                key={variant}
                className="text-xs font-medium text-fg-subtle whitespace-nowrap pb-2"
              >
                {variant}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buttonSizes.map((size) => (
            <tr key={size}>
              <td className="text-xs font-medium text-fg-subtle pr-2 whitespace-nowrap">
                size-{size}
              </td>
              {buttonVariants.map((variant) => (
                <td key={variant}>
                  <Button variant={variant} size={size}>
                    Button
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
