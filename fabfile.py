# coding: utf-8

import os
import fab
from invoke import Collection
from fabric import Config

connect_kwargs = dict(
    host='80.87.202.10',
    user='superadmin',
    connect_kwargs=dict(key_filename=os.path.join(os.path.expanduser("~"), '.ssh/superadmin')),
    project_container='proamursk',
    project_root='/var/www/proamursk/',
    project_path='/var/www/proamursk/proamursk/',
    containers=[],
    db_name='proamursk_prod',
    db_user='superadmin',
    db_pass='air3N97r',
    db_engine='postgres',
    repo=dict(
        proamursk=dict(path='/var/www/proamursk/proamursk/', branch='master'),
        cp_vue=dict(path='/var/www/proamursk/proamursk/cp_vue/', branch='master'),
        core=dict(path='/var/www/proamursk/proamursk/core/', branch='master')
    )
)

for name, val in fab.__dict__.items():
    if callable(val) and hasattr(val, 'hosts'):
        val.hosts = [connect_kwargs.get('host')]

ns = Collection.from_module(fab, config=connect_kwargs, auto_dash_names=True)
