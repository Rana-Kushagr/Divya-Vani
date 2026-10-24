import React from 'react';
import LearnWorkspaceClient from './LearnWorkspaceClient';

export function generateStaticParams() {
  const classes = ['class-6', 'class-7', 'class-8', 'class-9', 'class-10', 'class-11', 'class-12'];
  const subjects = ['science', 'maths', 'social_science', 'english', 'hindi', 'sanskrit'];
  const params: { class: string; subject: string }[] = [];
  for (const cls of classes) {
    for (const sub of subjects) {
      params.push({ class: cls, subject: sub });
    }
  }
  return params;
}

export default function LearnPage({ params }: { readonly params: { readonly class: string; readonly subject: string } }) {
  return <LearnWorkspaceClient routeParams={params} />;
}
