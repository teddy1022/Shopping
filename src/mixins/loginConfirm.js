export default {
  created () {
  },
  data () {
    return {
      title: '標題'
    }
  },
  methods: {
    sayHi () {

    },
    loginConfirm () {
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '請先登入',
          confirmButtonText: '去登入',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {})
        return true
      }
      return false
    }
  }
}
