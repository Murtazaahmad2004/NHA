create database nha;
use nha;
create table form (
id INT AUTO_INCREMENT PRIMARY KEY,
total_days int,
total_presents int,
total_leaves int,
late_in int,
early_out int,
late_out int,
early_in int,
el_on_hands int,
avg_counting_time int,
avg_out_time int,
cl_on_hands int,
year timestamp
);