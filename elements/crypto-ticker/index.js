import { LitElement, html, css, customElement } from 'lit-element';
import Reloader from '../../lib/decorators/reloader';

@customElement('phx-crypto-ticker')
@Reloader({
    timer: 10000,
    reloaderCallback: 'fetchData'
})
export class PhxCryptoTicker extends LitElement {
    static get properties() {
        return {
            currency: {
                type: String,
                attribute: true
            },
            cryptoid: {
                type: String,
                attribute: true
            },
            data: {
                type: Object
            },
            icon: {
                type: String
            }
        };
    }

    static get styles() {
        return css`
            .ticker {
                font-family: arial;
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 400px;
                margin: auto;
            }
            .ticker--data {
                padding: 20px;
                flex: 67%;
            }
            .ticker--selected-coin {
                display: flex;
                flex: 33%;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .ticker--logo {
                width: 45px;
            }
            .ticker--data-row {
                display: flex;
                justify-content: space-between;
                padding: 5px;
            }
            .ticker--data-current-price {
                font-size: 1.25em;
                text-align: center;
            }
            .ticker--copyright {
                border-top: 1px solid rgba(0, 0, 0, 0.4);
                font-size: 0.8em;
                text-align: center;
                padding: 8px;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }

    fetchData() {
        if (!this.currency || !this.cryptoid || !this.offsetParent) {
            return;
        }
        console.log('fetchData called', this);
        fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.currency}&ids=${this.cryptoid}`
        )
            .then((resp) => resp.json())
            .then((data) => {
                this.data = data[0];
                if (this.data && this.data.symbol) {
                    import(
                        `../../icons/${this.data.symbol.toLowerCase()}.js`
                    ).then((module) => {
                        if (module) {
                            this.icon = html`<div class="ticker--logo">
                                ${module.default}
                            </div>`;
                        }
                    });
                }
            })
            .catch((error) => console.error('Error:', error));
    }

    renderCoinLogo() {
        return html`<div class="ticker--logo">${bitcoinLogo}</div>`;
    }

    renderItemRow(title, value) {
        return html`<div class="ticker--data-row">
            <div class="ticker--date-row-title">${title}</div>
            <div class="ticker--date-row-data">${value}</div>
        </div>`;
    }

    render() {
        return html`<div class="ticker">
            <div class="ticker--selected-coin">
                ${this.icon}
                <strong class="ticker--coin-name"> ${this.data?.name} </strong>
                <div class="ticker--coin-currency">
                    ${this.data?.symbol?.toUpperCase()} /
                    ${this.currency.toUpperCase()}
                </div>
            </div>
            <div class="ticker--data">
                <div class="ticker--data-current-price">
                    <strong
                        >$${this.data?.current_price.toLocaleString(
                            'en-US'
                        )}</strong
                    >
                </div>
                ${this.renderItemRow(
                    'Market Cap Rank',
                    `#${this.data?.market_cap_rank}`
                )}
                ${this.renderItemRow(
                    'Market Cap',
                    `$${this.data?.market_cap.toLocaleString('en-US')}`
                )}
                ${this.renderItemRow(
                    'Total Volume',
                    `${this.data?.total_volume.toLocaleString('en-US')}`
                )}
                ${this.renderItemRow(
                    '24hr high/low',
                    `$${this.data?.high_24h.toLocaleString(
                        'en-US'
                    )} / $${this.data?.low_24h.toLocaleString('en-US')}`
                )}
            </div>
            <div class="ticker--copyright">
                Powered by <a href="https://www.coingecko.com/en">CoinGecko</a>
            </div>
        </div>`;
    }
}
