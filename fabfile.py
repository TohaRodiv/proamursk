# coding: utf-8

import os
import fab
from invoke import Collection
from fabric import Config

connect_kwargs = dict(
    host='80.87.202.10',
    user='fab_client',
    connect_kwargs=dict(key_filename=os.path.join(os.path.expanduser("~"), '.ssh/fab_client')),
    project_name='proamursk',
    git=[
        dict(branch='master', path='./'),
        dict(branch='300ms', path='./cp_vue/'),
        dict(branch='master', path='./core/'),
    ]
)

for name, val in fab.__dict__.items():
    if callable(val) and hasattr(val, 'hosts'):
        val.hosts = [connect_kwargs.get('host')]

ns = Collection.from_module(fab, config=connect_kwargs, auto_dash_names=True)
