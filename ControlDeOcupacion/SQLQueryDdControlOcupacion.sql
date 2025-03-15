use controlOcupacion

create table usuario(
	idUsuario int primary key identity,
	nombre varchar(50) not null,
	usuario varchar(20) not null,
	contrasena varchar(20) not null
	)
alter table usuario alter column contrasena varchar(70) not null

select*from usuario
select*from usuario where idUsuario=1
select SCOPE_IDENTITY()
select top 1 * from usuario order by idUsuario desc

insert into usuario(nombre, usuario, contrasena) values
('Diego Estrada', 'diees@gmail.com', 'estdiego123')

insert into usuario(nombre, usuario, contrasena) values('', '', '')

delete from usuario where idUsuario=1

update usuario set nombre='', usuario='', contrasena='' where idUsuario=1

-- procedimiento almacenado para verificar la existencia de un usuario
create or alter procedure sp_existenciaUsuario(@usuario varchar(20))
as
	begin
		select usuario from usuario where usuario = @usuario
	end

exec sp_existenciaUsuario @usuario = 'juanp35'

-- procedimiento almacendado para loggear un usuario (ya no utilizado).
create or alter procedure sp_login(
	@usuario varchar(20), 
	@contrasena varchar(20))
as
	begin
		select top 1 idUsuario, nombre, usuario from usuario 
			where usuario = @usuario and contrasena = @contrasena 
	end

exec sp_login @usuario='juanp35', @contrasena='perez11232323'