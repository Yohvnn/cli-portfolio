import { TEXT } from "../constants/ui";

interface SectionHeaderProps {
    children: React.ReactNode;
}

export function SectionHeader({ children }: SectionHeaderProps) {
    return (
        <h2 className={TEXT.sectionHeader}>
            {"// "}{children}
        </h2>
    );
}
