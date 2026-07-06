# Aigenis Coupon Calendar

A mobile-friendly calendar for [Aigenis](https://invest.aigenis.by) investors to see upcoming bond coupon and nominal payouts from their portfolio.

## Problem

If you hold bonds on Aigenis, payout dates and amounts are spread across individual securities in your portfolio. Planning cash flow for the year means checking each position manually.

This app connects to the Aigenis API, loads your holdings, and builds a single payout calendar grouped by month. You can filter by year, see totals for coupons and nominal repayments, and refresh your schedule on demand.

## Features

- Sign in with your Aigenis account
- Month-by-month view of upcoming coupon and nominal payouts
- Year filter with annual totals
- English and Russian UI
- Android app via Capacitor (web build also supported)

## Tech stack

| Layer        | Technologies                                                       |
| ------------ | ------------------------------------------------------------------ |
| Framework    | [Angular](https://angular.dev/) 22, standalone components, signals |
| UI           | [Ionic](https://ionicframework.com/) 8                             |
| Mobile       | [Capacitor](https://capacitorjs.com/) 8 (Android)                  |
| i18n         | [Transloco](https://jsverse.github.io/transloco/)                  |
| Dates        | [date-fns](https://date-fns.org/)                                  |
| HTTP / state | Angular HttpClient, RxJS                                           |
| Tooling      | pnpm, ESLint, Prettier, Husky                                      |

## About this project

This is a personal test project built with significant help from AI coding assistants (Cursor). It was created to explore how far AI-assisted development can take a real-world mobile app — from scaffolding and API integration to native packaging — not as an official Aigenis product.

## Getting started

See [CONTRIBUTION.md](./CONTRIBUTION.md) for prerequisites, local development, building, testing, and Android packaging.
