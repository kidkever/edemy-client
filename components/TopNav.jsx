import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  CarryOutOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  // router
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logoutHandler = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    // toast.success(data.message);
    router.push("/login");
  };

  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a>App</a>
        </Link>
      </Item>

      {user ? (
        <>
          <SubMenu
            icon={<CoffeeOutlined />}
            title={user && user.name}
            className="float-right"
          >
            <ItemGroup>
              <Item
                key="/user"
                onClick={(e) => setCurrent(e.key)}
                className="text-center"
              >
                <Link href="/user">
                  <a>Dashboard</a>
                </Link>
              </Item>
              <Item onClick={logoutHandler} className="text-center">
                Logout
              </Item>
            </ItemGroup>
          </SubMenu>

          {user.role.includes("Instructor") ? (
            <>
              <Item
                key="/instructor"
                onClick={(e) => setCurrent(e.key)}
                icon={<TeamOutlined />}
                className="float-right"
              >
                <Link href="/instructor">
                  <a>Instructor</a>
                </Link>
              </Item>
              <Item
                key="/instructor/course/create"
                onClick={(e) => setCurrent(e.key)}
                icon={<CarryOutOutlined />}
                className="float-right"
              >
                <Link href="/instructor/course/create">
                  <a>Create course</a>
                </Link>
              </Item>
            </>
          ) : (
            <Item
              key="/user/become-instructor"
              onClick={(e) => setCurrent(e.key)}
              icon={<TeamOutlined />}
              className="float-right"
            >
              <Link href="/user/become-instructor">
                <a>Become Instructor</a>
              </Link>
            </Item>
          )}
        </>
      ) : (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
            className="float-right"
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>
          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
            className="float-right"
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}
    </Menu>
  );
};

export default TopNav;
