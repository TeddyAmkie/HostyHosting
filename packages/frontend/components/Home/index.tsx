import { useState } from 'react';
import { Button, List, Menu, Dropdown, Typography } from 'antd';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Link from 'next/link';
import CreateApplication from './CreateApplication';
import { useApplicationsQuery } from '../../queries';
import SelectOrganization from './SelectOrganization';
import PageHeader from '../ui/PageHeader';
import TailwindDropdown, { DropdownItem } from '../ui/Dropdown';
import { ListItem } from '../ui/List';
import Card from '../ui/Card';

const ListLink = styled.a`
    display: block;
    border-bottom: 1px solid #f0f0f0;
    :last-child {
        border-bottom: none;
    }
`;

type Props = {
    // The ID for the organzation.
    // If not present, we will assume the user personal organization
    organization?: number;
};

export default function Home({ organization }: Props) {
    const { data, loading } = useApplicationsQuery({
        variables: {
            org: organization
        }
    });

    // TODO: Convert to useBoolean
    const [visible, setVisible] = useState(false);

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => setVisible(true)}>
                New Application
            </Menu.Item>
            <Menu.Item key="2">New Router</Menu.Item>
        </Menu>
    );

    return (
        <div>
            <PageHeader>
                <div className="flex">
                    <div className="flex-grow">
                        <SelectOrganization organization={organization} />
                    </div>
                    <TailwindDropdown label="New">
                        <DropdownItem onClick={() => setVisible(true)}>
                            New Application
                        </DropdownItem>
                        <DropdownItem>New Router</DropdownItem>
                    </TailwindDropdown>
                </div>
            </PageHeader>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-4 sm:px-0">
                        <Card
                            header={
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Applications
                                </h3>
                            }
                        >
                            <ul>
                                {data?.organization.applications.map(application => (
                                    <ListItem
                                        href="/applications/[id]"
                                        as={`/applications/${application.id}`}
                                    >
                                        <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                                            {application.name}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            </main>

            <CreateApplication
                organization={organization}
                visible={visible}
                onClose={() => setVisible(false)}
            />
        </div>
    );
}
