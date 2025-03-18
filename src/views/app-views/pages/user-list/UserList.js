import { useCallback, useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Tooltip, Button } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UserView from './UserView';
import { deleteUserRequest, fetchUsersRequest } from 'redux/actions';
import Loading from 'components/shared-components/Loading';
import { Typography } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

export const UserList = () => {
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
	const dispatch = useDispatch();
  const {path} = useRouteMatch();
  const usersState = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch])

	const deleteUser = useCallback((userId) => {
		dispatch(deleteUserRequest(userId));
	}, [dispatch]);

	const showUserProfile = userInfo => {
		setUserProfileVisible(true);
		setSelectedUser(userInfo);
	};
	
	const closeUserProfile = () => {
		setUserProfileVisible(false);
		setSelectedUser(null);
	}

  const tableColumns = useMemo(() => [
    {
      title: 'User',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="d-flex flex-column">
          <Typography.Text>{record.name}</Typography.Text>
          <Typography.Text type="secondary">{record.email}</Typography.Text>
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
            b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (_, record) => (
          <Typography.Text>{record.phone}</Typography.Text>
      ),
    },
    {
      title: 'WebSite',
      dataIndex: 'website',
      render: (_, record) => <Typography.Text>{record.website}</Typography.Text>,
      sorter: {
        compare: (a, b) => {
          a = a.website.toLowerCase();
            b = b.website.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <Tooltip title="View">
            <Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => showUserProfile(elm)} size="small"/>
          </Tooltip>
          <Tooltip title="Edit Profile">
            <Link to={`${path}/edit-profile/${elm.id}`}>
              <Button type="primary" className="mr-2" icon={<EditOutlined />} size="small"/>
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button danger icon={<DeleteOutlined />} onClick={()=> deleteUser(elm.id)} size="small"/>
          </Tooltip>
        </div>
      )
    }
  ], [deleteUser, path]);

  if (usersState.loading) {
    return <Loading cover="content"/>
  }

  return (
    <Card bodyStyle={{'padding': '0px'}}>
      <Table columns={tableColumns} dataSource={usersState.users} rowKey='id' />
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile}/>
    </Card>
  )
}

export default UserList
