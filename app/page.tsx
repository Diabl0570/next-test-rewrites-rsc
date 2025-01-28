"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Test = ({ page, href }: { page: string; href?: string }) => {
  const router = useRouter();
  href ??= `/${page}`;

  const id = page.replaceAll("/", "-");
  return (
    <div>
      <p>
        <a id={`link-${id}`} href={href}>
          Anchor to /{page}
        </a>
      </p>
      <p>
        <Link id={`link-${id}`} href={href}>
          Link to /{page}
        </Link>
      </p>
      <p>
        <button
          id={`button-${id}`}
          onClick={async () => {
            router.push(href);
          }}
        >
          Button to /{page}
        </button>
      </p>
    </div>
  );
};

export default function Page() {
  return (
    <>
      <Test page="gb/cart/" />
    </>
  );
}
