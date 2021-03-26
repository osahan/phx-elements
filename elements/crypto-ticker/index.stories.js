import './index';

export default {
    title: 'Crypto Ticker'
};

const Template = (args) => {
    return `<phx-crypto-ticker cryptoid="${args.cryptoid}" currency="${args.currency}"></phx-crypto-ticker>`;
};

const IntersectionTemplate = (args) => {
    return `<div style="padding-top: 100vh;"></div>
        <phx-crypto-ticker cryptoid="${args.cryptoid}" currency="${args.currency}"></phx-crypto-ticker>
    <div style="padding-top: 100vh;"></div>`;
};

export const bitcoinTicker = Template.bind({});
bitcoinTicker.args = {
    currency: 'usd',
    cryptoid: 'bitcoin'
};

export const ethereumTickerIntersectionLoader = IntersectionTemplate.bind({});
ethereumTickerIntersectionLoader.args = {
    currency: 'usd',
    cryptoid: 'ethereum'
};
