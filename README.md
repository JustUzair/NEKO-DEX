# TO DO

`NEKO_DEX.sol`
1) make a getter function to calculate the amount of LP tokens to be minted.
2) make a getter function to calcualte the maount of assets to send when burning LP tokens.

`LEADERBOARD.sol`
<b>
1) fix for loop to be more efficient, (remove checking all owners, just check to see if user has a number) </b>

`game.js - game design`
<b>
1) move leaderboard to room 2
2) move divs for stickynotes and div for DEX. Also set up appropriate borders for the player to not walk through.
3) add cats that walk around
</b>

`game.js - web3 logic`
<b>
1) add liquidity, remove liquidity implementation in DEX
2) add leaderboard implementation</b>
3) add staking contract in room 2

`art`
<b>
1) 2nd room
2) New character sprites (animations for walking up, down, right, left, and idle)
</b>

<br/> <br/>
=========================================================



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
