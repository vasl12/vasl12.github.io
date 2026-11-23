/**
 * Site configuration — edit this file to personalize the site.
 */
window.SITE_CONFIG = {
    name: 'Vasiliki Sideri-Lampretsa',
    nameVariations: [
        'Vasiliki Sideri-Lampretsa',
        'V. Sideri-Lampretsa',
        'V Sideri-Lampretsa',
        'Sideri-Lampretsa, Vasiliki',
        'Sideri-Lampretsa, V.'
    ],

    affiliation: 'Technical University of Munich',

    contactEmail: 'vasiliki.sideri-lampretsa@tum.de',

    semanticScholarId: '2153993999',
    googleScholarId: 'G1hpNYYAAAAJ',

    githubUser: 'vasl12',

    excludeRepos: ['vasl12.github.io'],

    siteUrl: 'https://vasl12.github.io/',

    // Hand-picked project sites to show in the projects carousel alongside
    // the auto-fetched vasl12 GitHub Pages repos. These render first.
    extraProjects: [
        {
            name: 'inr-xp',
            title: 'What Cohort INRs Encode and Where to Freeze Them',
            description: 'Investigates which layers of cohort-trained implicit neural representations transfer to new signals, and uses sparse autoencoders to reveal that different architectures learn fundamentally different encoded representations.',
            siteUrl: 'https://inr-xp.github.io/',
            repoUrl: 'https://github.com/inr-xp/inr-xp.github.io',
            language: null,
            license: null,
            topics: ['INRs', 'transfer learning', 'interpretability', 'SIREN', 'sparse autoencoders'],
            pushedAt: '2026-11-22',
            stars: 0,
            forks: 0,
            watchers: 0,
            openIssues: 0,
        },
        {
            name: 'SINR',
            title: 'SINR: Spline-enhanced Implicit Neural Representation for Multi-modal Registration',
            description: 'Code for the MIDL 2024 Best Oral Paper. A flexible and efficient neural framework for medical image alignment across modalities, advancing the state of the art in cardiac image analysis.',
            siteUrl: 'https://github.com/vasl12/SINR',
            repoUrl: 'https://github.com/vasl12/SINR',
            imageUrl: 'https://raw.githubusercontent.com/vasl12/SINR/main/overview.png',
            language: 'Python',
            license: null,
            topics: ['implicit neural representations', 'image registration', 'multi-modal', 'MIDL 2024'],
            pushedAt: '2025-05-22',
            stars: 16,
            forks: 3,
            watchers: 16,
            openIssues: 0,
        },
        {
            name: 'DiffDef',
            title: 'Diff-Def: Diffusion-Generated Deformation Fields for Conditional Atlases',
            description: 'IEEE TMI 2025. Latent diffusion models used to synthesize spatial transformations that deform existing anatomy, creating conditional atlases while avoiding hallucinations in the intensity domain.',
            siteUrl: 'https://github.com/starcksophie/DiffDef',
            repoUrl: 'https://github.com/starcksophie/DiffDef',
            imageUrl: 'images/diffdef.png',
            language: 'Python',
            license: null,
            topics: ['diffusion models', 'deformation fields', 'conditional atlases', 'IEEE TMI 2025'],
            pushedAt: '2026-07-08',
            stars: 0,
            forks: 0,
            watchers: 0,
            openIssues: 4,
        },
    ],
};
