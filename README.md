# tray-infinityscroll
Infinity product scroll for Tray stores

## Usage

```sh
<script src="{{ asset('js/tray-smartcart.js') }}"></script>

<div class="products-grid-footer col-xs-12">
    <div class="pagination">
        {{ _view.element('snippets/paginate') }}
    </div>

    <div class="loading">
        <img src="{{ themePath }}img/loading.gif" alt="Loading" />
    </div>
    <button class="button load-more">
        Carregar mais produtos <i class="fa fa-refresh" aria-hidden="true"></i>
    </button>
</div>
```
