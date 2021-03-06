import React from 'react';
import { useSelector } from 'react-redux';
import './portfolioList.sass'

export default function PortfolioList() {
    
    const cryptoPortfolio = useSelector(({crypto}) => crypto.portfolio);

    return (
        <div className="portfolio-list">
                    
            <h2 className="finance__subtitle">
                Ваши активы
            </h2>

            <div className="finance-nav">
                <div className="finance-nav__item finance-nav__item_name">
                    Название
                </div>
                <div className="finance-nav__item finance-nav__item_price">
                    Цена
                </div>
                <div className="finance-nav__item finance-nav__item_profit24">
                    24ч. 
                </div>
                <div className="finance-nav__item finance-nav__item_profitAll">
                    Прибыль/убытки
                </div>
                <div className="finance-nav__item finance-nav__item_avgPrice">
                    Ср. цена покупки
                </div>
                <div className="finance-nav__item finance-nav__item_holdings">
                    Активы
                </div>
            </div>
            <div className="portfolio-list__block">
            {
                        cryptoPortfolio.map(({id, buyName, image, buyPrice, currentPrice, priceChange, coinCount, coinValue, symbol}) => (
                            buyName === '' ? '' :
                            <div className="portfolio-list__item" key={id}>
                            <div className="portfolio-list__name">
                                <img className="portfolio-list__name-image" src={image} alt="" />
                                <div className="portfolio-list__name-column">
                                    <div className="portfolio-list__name-ticker">
                                        {symbol.toUpperCase()}
                                    </div>
                                    <div className="portfolio-list__name-text">
                                        {buyName}
                                    </div>
                                </div>
                            </div>

                            <div className="portfolio-list__price">
                                {currentPrice.toLocaleString()}$
                            </div>

                            <div className="portfolio-list__24h">
                                <div className={priceChange > 0 ? "portfolio-list__24h-change portfolio-list__24h-change_green" : "portfolio-list__24h-change portfolio-list__24h-change_red"}>
                                    {priceChange.toFixed(2)}% 
                                </div>
                            </div>

                            <div className={(currentPrice*coinCount-buyPrice*coinCount) > 0 ? "portfolio-list__profitAll portfolio-list__profitAll_green" : "portfolio-list__profitAll portfolio-list__profitAll_red"}>
                                {(currentPrice*coinCount-buyPrice*coinCount).toFixed(2)}$
                            </div>
                            
                            <div className="portfolio-list__avgPrice">
                                {buyPrice.toFixed(2)}$
                            </div>

                            <div className="portfolio-list__holdings">
                                <div className="portfolio-list__holdings_sum">
                                    $ {(coinCount * coinValue).toLocaleString()}
                                </div>
                                <div className="portfolio-list__holdings_symbol">
                                    {coinCount} {symbol.toUpperCase()}
                                </div>
                            </div>                            
                            
                        </div>
                        ))
                    }
            </div>
        </div>
    )
}
