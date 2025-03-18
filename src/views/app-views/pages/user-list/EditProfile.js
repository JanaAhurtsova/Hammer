import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Input, Row, Col } from 'antd';
import { fetchUserByIdRequest, updateUser } from 'redux/actions';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import Loading from 'components/shared-components/Loading';

const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { selectedUser, loading } = useSelector((state) => state.users);
  const { userId } = useParams();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserByIdRequest(userId));
    }
  }, [dispatch, userId]);

  const initialValues = useMemo(() => ({
    name: selectedUser?.name,
    email: selectedUser?.email,
    username: selectedUser?.username,
    phone: selectedUser?.phone,
    website: selectedUser?.website,
    street: selectedUser?.address.street,
    suite: selectedUser?.address.suite,
    city: selectedUser?.address.city,
    zipcode: selectedUser?.address.zipcode,
    companyName: selectedUser?.company.name
  }), [selectedUser])

  const formFields = useMemo(() => [
    { 
      label: "Name",
      name: 'name',
      rules: [{
        required: true,
        message: 'Please input name!',
      },]
    },
    { 
      label: "Username",
      name: 'username',
      rules: [{
        required: true,
        message: 'Please input username!'
      },]
    },
    { 
      label: "Email",
      name: 'email',
      rules: [{ 
        required: true,
        type: 'email',
        message: 'Please enter a valid email!' 
      }]
    },
    { 
      label: "Phone Number",
      name: 'phone',
    },
    { 
      label: "Street",
      name: 'street',
    },
    { 
      label: "Suite",
      name: 'suite',
    },
    { 
      label: "City",
      name: 'city',
    },
    { 
      label: "Post code",
      name: 'zipcode',
    },
    { 
      label: "Company name",
      name: 'companyName',
    },
  ], []);

  if (loading) {
    return <Loading cover="content"/>
  }

  const onFinish = values => {
    setUpdating(true);
    setTimeout(() => {
      dispatch(updateUser({
        id: userId,
        name: values.name,
        email: values.email,
        username: values.userName,
        phone: values.phone,
        website: values.website,
        address: {
          ...selectedUser.address,
          street: values.street,
          suite: values.suite,
          city: values.city,
          zipcode: values.zipcode, 
        },
        company: {
          ...selectedUser.company,
          name: values.companyName
        }
      }))
      setUpdating(false);
      history.goBack()
    }, 1000);
		};

    const onFinishFailed = errorInfo => {
			console.error('Failed:', errorInfo);
		};

  return (
				<div className="mt-4">
					<Form
						name="basicInformation"
						layout="vertical"
						initialValues={initialValues}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
					>
						<Row>
							<Col xs={24} sm={24} md={24} lg={16}>
								<Row gutter={ROW_GUTTER}>
                  {formFields.map((item) => (
                    <Col xs={24} sm={24} md={12} key={item.name}>
										<Form.Item
											label={item.label}
											name={item.name}
											rules={item.rules}
										>
											<Input />
										</Form.Item>
									</Col>))}
								</Row>
								<Button type="primary" htmlType="submit" loading={updating}>
									Save Change
								</Button>
							</Col>
						</Row>
					</Form>
				</div>
		)
	}

  export default EditProfile;