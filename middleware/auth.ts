import { useUserStore } from '@/stores/user';
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { firebaseUserStore } = useUserStore()
  
  // redirect the user to the login page
  if (!firebaseUserStore) {
    return navigateTo({
      path: '/authentification',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})
