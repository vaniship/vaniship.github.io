# MySQL 问题定位

## 基本诊断操作

以下是数据库和表的基本信息查询操作。

```sql
-- 列出所有数据库
SHOW DATABASES;

-- 列出系统中正在运行的所有进程，也就是当前正在执行的查询。
-- 大多数用户可以查看他们自己的进程，如果拥有 process 权限，就可以查看所有人的进程，包括密码。
SHOW PROCESSLIST;

-- 列出数据库最近的警告信息
SHOW WARNINGS;

-- 列出数据库的状态信息
SHOW STATUS LIKE '%keyword%';

-- 列出数据库中的变量
SHOW GLOBAL VARIABLES LIKE '%keyword%';
SHOW SESSION VARIABLES LIKE '%keyword%';

-- 列出指定数据库的所有表
SHOW database_name.TABLES LIKE '%keyword%';

-- 列出所有表的状态
SHOW TABLE STATUS LIKE '%keyword%'; -- 按表名过滤
SHOW TABLE STATUS WHERE comment LIKE '%keyword%'; -- 按指定字段的值过滤

-- 列出指定表的索引
SHOW INDEX FROM database_name.table_name;
```

### 关键信息

检查数据库最大链接数:

```sql
SHOW VARIABLES WHERE variable_name = 'max_connections'
```

### 分析当前正在执行的查询

列出当前正在执行的查询:

```sql
SHOW PROCESSLIST;
```

## 找到慢 SQL

### 将慢 SQL 输出到日志

与慢 SQL 日志相关的系统变量：

* slow_query_log：指定是否开启慢查询日志
* long_query_time：设定慢查询的阀值，超出次设定值的 SQL 即被记录到慢查询日志，缺省值为10s
* slow_query_log_file：指定慢日志文件存放位置，可以为空，系统会给一个缺省的文件host_name-slow.log
* min_examined_row_limit：查询检查返回少于该参数指定行的SQL不被记录到慢查询日志
* log_queries_not_using_indexes: 不使用索引的慢查询日志是否记录到索引
* log_slow_queries：指定是否开启慢查询日志(该参数要被 slow_query_log 取代，做兼容性保留)

可通过修改系统变量开启慢 SQL 日志（重启后失效），也可通过在 my.cnf 中添加如下配置永久开启慢 SQL 日志（需重启MySQL）：

```ini
slow_query_log=on
slow_query_log_file=/tmp/mysql-slow.log # 慢日志保存路径
long_query_time=5 # 大于 5s 的 SQL 查询
```

### 实时查看

也可通过在 mysql 客户端执行下面的语句查看执行过慢的 SQL 语句：

```sql
-- 查看当前执行缓慢的 sql 语句
SELECT id, user, host, db, command, `time`, `state`, info FROM information_schema.processlist where command <> 'Sleep' and time > 5;
```

## 使用 Explain 分析

explain 可以用来分析 SQL 的执行计划。

### 关于扫描方式

explain 返回的 type 字段表示的是``连接类型``(the join type)，也即数据的扫描方式，最为常见的扫描方式有：

* system
  * 系统表，少量数据，往往不需要进行磁盘IO
  * 这类扫描是速度最快的
* const
  * 常量连接
* eq_ref
  * 主键索引(primary key)或者非空唯一索引(unique not null)的等值链接
  * 这类扫描的速度也异常之快
* ref
  * 非主键非唯一索引的等值链接
* range
  * 是索引上的范围查询，会在索引上扫码特定范围内的值
  * between，in，> 都是典型的范围(range)查询，条件必须是索引
* index
  * 索引树扫描，需要扫描索引上的全部数据
  * 仅比全表扫描快一点
* ALL
  * 全表扫描(full table scan)

上面各类扫描方式由快到慢：

system > const > eq_ref > ref > range > index > ALL
