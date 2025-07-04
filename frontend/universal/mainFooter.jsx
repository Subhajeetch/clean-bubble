import { FaInstagram, FaTwitter, FaFacebook, FaGithub } from "react-icons/fa";

const footerLinks = [
    {
        title: "Company",
        links: [
            { name: "About", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
        ],
    },
    {
        title: "Support",
        links: [
            { name: "Contact", href: "/contact" },
            { name: "Help Center", href: "/help" },
            { name: "Privacy Policy", href: "/privacy" },
        ],
    },
    {
        title: "Product",
        links: [
            { name: "Features", href: "/features" },
            { name: "Pricing", href: "/pricing" },
            { name: "Reviews", href: "/reviews" },
        ],
    },
];

const socialLinks = [
    { icon: <FaInstagram />, href: "https://instagram.com" },
    { icon: <FaTwitter />, href: "https://twitter.com" },
    { icon: <FaFacebook />, href: "https://facebook.com" },
    { icon: <FaGithub />, href: "https://github.com" },
];

export default function MainFooter() {
    return (
        <footer className="bg-background border-t border-muted mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-10">
                {/* Logo and tagline */}
                <div className="flex-1">
                    <a href="/" className="text-2xl font-bold tracking-tight text-foreground">
                        CleanBubble
                    </a>
                    <p className="mt-2 text-muted-foreground text-sm max-w-xs">
                        Goodbye to sticky hands and hello to clean, soft skin!
                    </p>
                    <div className="flex gap-4 mt-4">
                        {socialLinks.map((s, i) => (
                            <a
                                key={i}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl text-muted-foreground hover:text-foreground transition"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
                {/* Links */}
                <div className="flex flex-1 justify-between gap-8">
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-semibold text-foreground mb-3">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition text-sm"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-muted py-4 text-center text-xs text-muted-foreground bg-background/80">
                © {new Date().getFullYear()} CleanBubble. All rights reserved.
            </div>
        </footer>
    );
}