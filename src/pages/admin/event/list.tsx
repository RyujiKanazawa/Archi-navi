import { Typography, Button, DatePicker, Form, Input, Card, Space, Table, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from 'layouts/admin'
import { httpClient } from 'services/httpClient'
import { ApiRoutes } from 'utils/constant'

const { Title } = Typography
const { RangePicker } = DatePicker

interface DataType {
   key: React.Key
   name: string
   title: string
   type: string
   content: string
   registeredAt: string
}

const AdminEventListPage: NextPageWithLayout = () => {
   const [dataSource, setDataSource] = useState([])
   const [totalData, setTotalData] = useState(1)
   const [currentPage, setCurrentPage] = useState(1)
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   useEffect(() => {
      fetchData(1)
   }, [])

   const [form] = Form.useForm()

   const fetchData = (page: number, values: any = null) => {
      setLoading(true)

      const queryParams = new URLSearchParams()

      if (values) {
         if (values.company) {
            queryParams.append('company', values.company)
         }
         if (values.content) {
            queryParams.append('content', values.content)
         }
         if (values.type) {
            queryParams.append('type', values.type)
         }
         if (values.registeredAt) {
            const [start, end] = values.registeredAt
            queryParams.append('start_date', start.format('YYYY-MM-DD'))
            queryParams.append('end_date', end.format('YYYY-MM-DD'))
         }
      }

      queryParams.set('page', page.toString())

      const queryString = queryParams.toString()

      httpClient()
         .get(`${ApiRoutes.event.index}?${queryString}`)
         .then((res) => {
            setDataSource(res.data.data)
            setTotalData(res.data.total)
            setCurrentPage(page)
         })
         .catch((err) => console.error(err))
      setLoading(false)
   }

   const onFinish = (values: any) => {
      fetchData(1, values)
   }

   const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo)
   }

   const resetButtonClick = () => {
      const values = {
         company: null,
         type: null,
         content: null,
         start_date: null,
         end_date: null,
      }
      form.setFieldsValue({
         company: values.company,
         type: values.type,
         content: values.content,
         registeredAt: null,
      })
      fetchData(1, values)
   }

   const confirmDelete = (id: number) => {
      setLoading(true)
      httpClient()
         .delete(`${ApiRoutes.event.index}/${id}`)
         .then((_res) => {
            fetchData(currentPage)
         })
         .catch((err) => console.error(err))
   }

   const goEdit = (id: number) => {
      router.push(`/admin/event/${id}`)
   }

   const columns: ColumnsType<DataType> = [
      {
         title: 'ID',
         dataIndex: 'id',
         key: `id`,
         width: '10%',
      },
      {
         title: '企業名',
         dataIndex: 'company',
         key: 'company',
         width: '15%',
      },
      {
         title: 'PICKUP設定',
         dataIndex: 'isPickup',
         key: 'isPickup',
         width: '10%',
      },
      {
         title: 'タイトル',
         dataIndex: 'title',
         key: 'title',
         width: '20%',
      },
      {
         title: '種別',
         dataIndex: 'type',
         key: 'type',
         width: '20%',
      },
      {
         title: '登録日',
         dataIndex: 'createdAt',
         key: 'createdAt',
         width: '10%',
      },
      {
         title: 'Action',
         key: 'operation',
         width: 160,
         render: (record) => (
            <Space>
               <Popconfirm
                  title='確認'
                  description='このデータを削除してもよろしいですか？'
                  onConfirm={() => confirmDelete(record.id)}
                  okText='はい'
                  cancelText='いいえ'
               >
                  <Button className='delete-button' type='primary' size='small' danger>
                     削除
                  </Button>
               </Popconfirm>
               <Button type='primary' size='small' onClick={() => goEdit(record.id)}>
                  編集
               </Button>
            </Space>
         ),
      },
   ]

   return (
      <>
         <Title level={2} style={{ textAlign: 'center' }}>
            インターン・イベント情報照会
         </Title>
         <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
            <Card>
               <Form
                  form={form}
                  name='basic'
                  initialValues={{ remember: true }}
                  autoComplete='off'
                  layout='vertical'
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
               >
                  <Form.Item label='企業名' name='company'>
                     <Input />
                  </Form.Item>

                  <Form.Item label='キーワード' name='content'>
                     <Input />
                  </Form.Item>

                  <Form.Item label='カテゴリー' name='type'>
                     <Input />
                  </Form.Item>

                  <Form.Item label='登録日' name='registeredAt'>
                     <RangePicker />
                  </Form.Item>

                  <Form.Item>
                     <Button type='primary' htmlType='submit'>
                        この条件で検索
                     </Button>
                     <Button type='primary' className='ms-2 !bg-red-500' onClick={resetButtonClick}>
                        検索条件をリセット
                     </Button>
                  </Form.Item>
               </Form>
            </Card>
            <Card>
               <Title level={3} style={{ textAlign: 'center' }}>
                  インターン・イベント情報一覧
               </Title>
               <Table
                  loading={loading}
                  columns={columns}
                  dataSource={dataSource}
                  tableLayout='auto'
                  scroll={{ x: 800 }}
                  rowKey='id'
                  pagination={{
                     total: totalData,
                     defaultPageSize: 10,
                     current: currentPage,
                     showSizeChanger: false,
                     onChange: (page, _pageSize) => {
                        fetchData(page)
                     },
                  }}
               />
            </Card>
         </Space>
      </>
   )
}

AdminEventListPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>

export default AdminEventListPage
