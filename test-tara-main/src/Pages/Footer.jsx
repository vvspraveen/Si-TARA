const Footer = () => {
    return (
        <div style={{width: '100%'}}>
            <footer class="o-footer -minimal" style={{ position: "relative", bottom: 0, backgroundColor: '#f0f0f0' }}>
                <hr class="a-divider" />
                <div class="e-container">
                    <div class="o-footer__bottom">
                        <ul class="o-footer__links">
                            <li>
                                <div class="a-link a-link--integrated" style={{ cursor: 'not-allowed' }}>
                                    <a href="#" target="_self" style={{ pointerEvents: "none", cursor: "not-allowed", opacity: .4 }}><span>Imprint</span></a>
                                </div>
                            </li>
                            <li>
                                <div class="a-link a-link--integrated" style={{ cursor: 'not-allowed' }}>
                                    <a href="#" target="_self" style={{ pointerEvents: "none", cursor: "not-allowed", opacity: .4 }}><span>Legal information</span></a>
                                </div>
                            </li>
                            <li>
                                <div class="a-link a-link--integrated" style={{ cursor: 'not-allowed' }}>
                                    <a href="#" target="_self" style={{ pointerEvents: "none", cursor: "not-allowed", opacity: .4 }}><span>Data privacy</span></a>
                                </div>
                            </li>
                            <li>
                                <div class="a-link a-link--integrated" style={{ cursor: 'not-allowed' }}>
                                    <a href="#" target="_self" style={{ pointerEvents: "none", cursor: "not-allowed", opacity: .4 }}><span>Disclosure documents</span></a>
                                </div>
                            </li>
                        </ul>
                        <hr class="a-divider" />
                        <div class="o-footer__copyright">
                            <i
                                class="a-icon boschicon-bosch-ic-copyright-frame"
                                title="Lorem Ipsum"
                            ></i>
                            2024 Bosch.IO GmbH, all rights reserved
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default Footer