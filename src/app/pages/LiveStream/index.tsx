/**
 *
 * LiveStream
 *
 */
import React, { memo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { FesInput } from 'app/components/FesInput/Loadable';
import { Col, Row, Button } from 'reactstrap';
import { createSettingSystem } from 'services/adminService';
import { useNotificationSlice } from 'app/pages/Notifications/slice';
import { selectNotification } from 'app/pages/Notifications/slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useGoldenTicketSlice } from 'app/pages/GoldenTicket/slice';
import { selectTimeSystem } from 'app/pages/GoldenTicket/slice/selectors';
import { messageSnacks } from 'app/constants';
import { toast } from 'react-toastify';

interface Props {}

export const LiveStream = memo((props: Props) => {
  const { t } = useTranslation();
  const { actions } = useNotificationSlice();
  const { actions: actionSystem } = useGoldenTicketSlice();
  const dataSystem = useSelector(selectTimeSystem);
  const dispatch = useDispatch();
  const listNotification = useSelector(selectNotification);

  const [chanel, setChanel] = useState('');
  const [id, setId] = useState<string>('');
  const [typeLivestream, setTypeLivestream] = useState('default');
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    dispatch(actions.getListNotification({}));
    dispatch(actionSystem.getTimeSystem({}));
  }, [actionSystem, actions, dispatch]);

  useEffect(() => {
    if (listNotification.results.length) {
      setId(listNotification.results[0]._id);
    }
    if (dataSystem && dataSystem.youtubeHistoryURL) {
      setChanel(
        `https://www.youtube.com/watch?v=${dataSystem.youtubeHistoryURL}`,
      );
    }
    if (dataSystem && dataSystem.typeLivestream) {
      setTypeLivestream(dataSystem.typeLivestream);
    }
  }, [dataSystem, listNotification.results]);

  const onSave = useCallback(async () => {
    if (!chanel) {
      setIsShow(true);
      return false;
    }
    if (!id) {
      return toast.error('?????? ?????? ????????? ??????????????????.');
    }
    setIsShow(false);
    const urlChannel = chanel.split('v=');
    const data = {
      youtubeHistoryURL: urlChannel[1],
      notificationSystemId: id,
      typeLivestream,
    };
    const res = await createSettingSystem(data);
    if (res) return messageSnacks.success();
  }, [chanel, id, typeLivestream]);

  return (
    <Div>
      <Title> {t('????????? ?????? ??????')} </Title>
      <Row>
        <Col sm={6}>
          <div className="pb-3">
            <p
              style={{
                marginBottom: 0,
              }}
              className="float-left"
            >
              {t('Link')}
            </p>
            <IconStart>*</IconStart>
            <FesInput
              placeholder="Link live stream ..."
              value={chanel}
              onChange={e => setChanel(e.target.value)}
            ></FesInput>
            {isShow && !chanel && (
              <span className="text-error-live-stream">
                ?????? ????????? ??????????????????!
              </span>
            )}
          </div>

          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <p
              style={{
                marginBottom: 0,
              }}
              className="float-left"
            >
              {t('livestream ??????')}
            </p>
            <IconStart>*</IconStart>
            <FesInput
              type="select"
              onChange={e => setTypeLivestream(e.target.value)}
            >
              <option
                key={1}
                value="default"
                selected={typeLivestream === 'default'}
              >
                ????????? ????????? ?????? ??????
              </option>
              <option key={2} value="live" selected={typeLivestream === 'live'}>
                ????????? ?????? ??????
              </option>
            </FesInput>
          </div>

          <div>
            <p
              style={{
                marginBottom: 0,
              }}
              className="float-left"
            >
              {t('?????? ?????? ??????')}
            </p>
            <IconStart>*</IconStart>
            <FesInput type="select" onChange={e => setId(e.target.value)}>
              {listNotification.results.length &&
                listNotification.results.map(op => (
                  <option key={op._id} value={op._id}>
                    {op.title}
                  </option>
                ))}
            </FesInput>
          </div>
        </Col>
        <Col sm={12} className="mt-3">
          <Button style={{ backgroundColor: '#2A4365' }} onClick={onSave}>
            {t('??????')}
          </Button>
        </Col>
      </Row>
    </Div>
  );
});

const Div = styled.div`
  background-color: #ecf0f5;
  padding: 1rem;
  height: 100%;

  .text-error-live-stream {
    display: block;
    color: red;
    margin-top: 10px;
  }
`;

const Title = styled.p`
  color: #2c5282;
  font-family: Roboto;
  font-size: 24px;
  font-weight: bold;

  padding-top: 1.5rem;
`;

const IconStart = styled.span`
  color: red;
  font-size: 22px;
  margin-left: 3px;
`;
