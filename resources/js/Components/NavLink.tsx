import { Link, InertiaLinkProps } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                (active
                    ? "text-foreground transition-colors hover:text-foreground "
                    : "text-muted-foreground transition-colors hover:text-foreground ") +
                className
            }
        >
            {children}
        </Link>
    );
}
