<script>
export default {
  name: 'CarbonAds',
  watch: {
    $route(to, from) {
      if (
        to.path !== from.path &&
        // Only reload if the ad has been loaded
        // otherwise it's possible that the script is appended but
        // the ads are not loaded yet. This would result in duplicated ads.
        this.$el.querySelector('#carbonads')
      ) {
        this.$el.innerHTML = '';
        this.load();
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const s = document.createElement('script');
      s.setAttribute('async', '');
      s.type = 'text/javascript';
      s.id = '_carbonads_js';
      s.src = `//cdn.carbonads.com/carbon.js?serve=CE7IK53U&placement=vcalendario`;
      this.$el.appendChild(s);
    },
  },
  render(h) {
    return h('div', { class: 'carbon-ads' });
  },
};
</script>

<style lang="stylus">
.carbon-ads {
  min-height: 102px;
  font-size: 0.75rem;
  margin: 0.5rem 0;

  a {
    color: #444;
    font-weight: normal;
    display: inline;
  }

  .carbon-img {
    float: left;
    margin-right: 1rem;
    border: 1px solid $borderColor;

    img {
      display: block;
    }
  }

  .carbon-poweredby {
    color: #999;
    display: block;
    margin-top: 0.5em;
  }
}

@media (max-width: $MQMobile) {
  .carbon-ads {
    .carbon-img img {
      width: 100px;
      height: 77px;
    }
  }
}
</style>
