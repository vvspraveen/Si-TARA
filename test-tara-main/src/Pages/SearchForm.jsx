const SearchForm = (props) => {
    return (
        <>
            <form class="m-search-form" autocomplete="off" style={{ margin: '5px'}}>
                <div class="a-text-field a-text-field--search">
                    <input style={{borderRadius:'0.5rem',border:0}} type="search" id="search-default" placeholder="Search Assets" value={props.value} onChange={props.onChange}/>
                    <button type="button" class="a-text-field__icon-search">
                        <i class="a-icon ui-ic-search" title="LoremIpsum"></i>
                    </button>
                    {props.value.length > 0 && <button type="button" class="a-text-field__icon-close" onClick={props.onClear}>
                        <i class="a-icon ui-ic-close-small" title="LoremIpsum"></i>
                    </button>}
                </div>
            </form>
        </>
    )
}

export default SearchForm;
