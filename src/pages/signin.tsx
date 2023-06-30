import type { NextPageWithLayout } from 'next'
import { useForm, SubmitHandler } from 'react-hook-form'
import { MainLayout } from 'layouts/main'
import { httpClient } from 'services/httpClient'
import Router from 'next/router'
import { ApiRoutes } from 'utils/constant'

type Inputs = {
  email: string
  password: string
}

const SigninPage: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await httpClient().post(ApiRoutes.auth.signin, data)
      if (res.data) {
        Router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(watch('email'))

  return (
    <>
      <div className='flex items-center justify-center'>
        <div className='mx-auto w-full max-w-xs'>
          <div className='py-6'>
            <h1 className='text-3xl font-bold'>会員ログイン</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='py-3'>
              <label htmlFor='email'>メールアドレス</label>
              <div>
                <input
                  type='text'
                  name='email'
                  placeholder='example@example.com'
                  className='ipt'
                  {...register('email', { required: true })}
                />
              </div>
              {errors.email && <span>メールアドレスは必須です</span>}
            </div>
            <div className='py-3'>
              <label htmlFor='email'>パスワード</label>
              <div>
                <input
                  type='password'
                  name='password'
                  className='ipt'
                  {...register('password', { required: true })}
                />
              </div>
              {errors.password && <span>パスワードは必須です</span>}
            </div>
            <div className='py-3'>
              <input type='submit' className='btn' />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

SigninPage.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default SigninPage